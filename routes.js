const routes = require('express').Router();
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const saltrounds = 10;
const dbService = require('./db');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { request } = require('http');
const { response } = require('express');


var sess;








routes.get('/questions', async (req, res) => {
    try {
        const questionss = await dbService.getQuestions();
       

        for (const id in questionss) {
            let question = questionss[id]
           
            const user = await dbService.getuserById(question.userid);
            question["user"] = user[0];

    }

    res.json(questionss);

}catch (error) {
        res.send("something wrong getting questions")
    }
});

routes.post('/addQuestion/', async (req, res) => {
    try {

        let mes = await dbService.addQuestion(req.body);
        res.json(mes);
    }
    catch (error) {
        res.send("couldnt add message");
    }
});



routes.get('/consumers', async (req, res) => {
    try {
        const consumers = await dbService.getUsers();
        res.send(consumers);
    }
    catch (error) {
        res.send('Något gick fel!')
    }
});

routes.get('/consumer', async (req, res) => {
    const data = req.body;
    try {
        const user = await dbService.getUser(data.username);
        res.send(user);
    }
    catch (error) {
        res.send('Något gick fel.')
    }
});

routes.get('/consumer/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const usercred = await dbService.getUserCredentials(username);
        res.send(usercred);
    }
    catch (error) {
        res.send('Något gick fel.')
    }
});



routes.post('/user/login', async (req, res) => {

    const data = req.body;

    try {
            
            const data = req.body;
            const user = await dbService.doLogin(data);
            if (user) {
                let ok = await comparePass(data.password, user.password);
                if (ok) {
                    sess = req.session;
                    let loggedin = await dbService.getUser(data.username);
                    sess.user = loggedin;
                    console.log(ok)                           
                    res.json(ok);                                                                                 
                }
                if(ok == null){        
                    res.send("Login failed")           
                }    
                            }
                            
               else {
                    res.send("Log in failed!")
                }
        
    } catch (error) {
        console.log(error);
    }
});

routes.get('/loggedinuser', async (req, res) => {
    try {

        sess = req.session;
        if (sess.user) {
            //We are loggged in and can return logged in user

            let obj = {
                "loggedin": true,
                "user": sess.user[0]
            }
            res.json(obj);

         } else {
            let obj = {
                "loggedin": false
            }

            res.json(obj);
        }

    } catch (error) {
        console.log(error);
        res.json("Gick ej att hämta användare")
    }
});

routes.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    })
});


routes.post('/add/consumer', async (req, res) => {
    const data = req.body;

    try {

        const valid = req.body;
        if (valid.email.length <= 50 && valid.firstname.length <= 20 && valid.lastname.length <= 20 && valid.username.length <= 20 && valid.password.length <= 30) {

            const hashpass = await genPass(req.body.password);
            const response = await dbService.addUser(req.body, hashpass);
            res.send(response);

        } else {
            console.log("Wrong input");
        }
    }
    catch (error) {
        console.log(error);
        res.json("Kan inte lägga till användare!")
    }


});



routes.post('/file', upload.single("file"), async (req, res) => {
    const uploadedFile = req.file;
    const exts = req.file.originalname.split('.');
    const fileEnd = exts[exts.length - 1];
    const consumerId = parseInt(req.body.id);
    const fileName = './public/uploads/' + consumerId + '.' + fileEnd;
    const fileName2 = '/uploads/' + consumerId + '.' + fileEnd;
    console.log(fileName)
    try {

        const filewrite = await fs.rename(uploadedFile.path, fileName);
        console.log(filewrite)
        await dbService.updateUserPicture(consumerId, fileName2)
        if (!filewrite) {
            res.json({ 'status': 'ok ' });
        }
        else {
            throw new Error('Could not write file');
        }
    } catch (error) {
        console.log(error);
        await fs.unlink(uploadedFile.path);
        res.status(400).json(error);
    }
});

routes.get('/contributors', async (req, res) => {
    data = req.body;
    try {
        const contributors = await dbService.getContributors(data);
        res.send(contributors);
    }
    catch (error) {
        res.send("something wrong with getting contributors")
    }
});


routes.delete('/question/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const dele = await dbService.deleteQuestion(id);
        res.send("question deleteted");
    }
    catch (error) {
        throw new Error("something went wrong when deleting");
    }

});
//
routes.put('/updateq/:id', async (req, res) => {
    const pId = req.params.id;
    try {

        const found = await dbService.getQuestionById(pId);
        if (found) {
            await dbService.updateQuestion(pId, req.body);
            res.send({ SUCCESS: `Question with the id: ${pId} updated` });
        } else {
            res
                .status(400)
                .send({ ERROR: `dosent exist` });
        }
    } catch (error) {
        res.send(error);
    }
});



//end point hämta enskild contributor
routes.get('/contributorby/:userid', async (req, res) => {
    const id = req.params.userid;
    try {
        const contributor = await dbService.getcontributorById(id);
        res.send(contributor);
    }
    catch (error) {
        res.send('something wrong getting single contributor with id')
    }
});

routes.get('/answers', async (req, res) => {
    
    try {
        const answers = await dbService.getAnswers();
        res.send(answers);
    }
    catch (error) {
        res.send("Error")
    }
});



//end point uppdatera enskild contributor
routes.put('/updatec/:userid', async (req, res) => {
    const cId = req.params.userid;
    try {

        const found = await dbService.getcontributorById(cId);
        if (found) {
            await dbService.updateContributor(cId, req.body);
            res.send({ SUCCESS: `contributor with the id: ${cId} updated` });
        } else {
            res
                .status(400)
                .send({ ERROR: `dosent exist` });
        }
    } catch (error) {
        res.send(error);
    }
});

//end point hämta enskild fråga med id
routes.get('/questionby/:id', async (req, res) => {
    const did = req.params.id;
    try {
        const questionss = await dbService.getQuestionById(did);

        for (const id in questionss) {
            let question = questionss[id]
           
            const user = await dbService.getuserById(question.userid);
            question["user"] = user[0];
    }
    res.json(questionss);
    }
    catch (error) {
        res.send('something wrong getting single question with id')
    }
});



routes.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const categories = await dbService.getCategories(category);
        
        for (const userid in categories) {
            let categoriess = categories[userid]

            const user = await dbService.getuserById(categoriess.userid);
            categoriess["user"] = user[0];
    }
    res.json(categories);
    }
    catch (error) {
        res.send('something wrong getting single with id')
    }
});

routes.get('/category', async (req, res) => {
    try {
        const categories = await dbService.getAllCategories();
       
        for (const userid in categories) {
            let categoriess = categories[userid]
           
            const user = await dbService.getuserById(categoriess.userid);
            categoriess["user"] = user[0];
    }
    res.json(categories);
    }
    catch (error) {
        res.send('something wrong getting single question with id')
    }
});




//ta bort?
routes.post('/contributoradd/', async (req, res) => {
    try {

        let cont = await dbService.addContributor(req.body);
        res.json(cont);
    }
    catch (error) {
        res.send("couldnt add contributor");
    }
});


// end point add answer
routes.post('/add/answer', async (req, res) => {
    try {
        let cont = await dbService.addAnswer(req.body);
        res.json(cont);
    }
    catch (error) {
        res.send("couldnt add your answer.,")
    }

});


routes.get('/answerby/:answerid', async (req, res) => {
    const id = req.params.answerid;
    try {
        const answers = await dbService.getAnswerByIdQuestioniforanswer(id);
       
        for (const id in answers) {
            let answer= answers[id]
            
            const user = await dbService.getuserById(answer.userid);
            answer["user"] = user[0];

    }

    res.json(answers);

    }
    catch (error) {
        res.send('something wrong getting single answer with id')
    }
});

routes.get('/answerbyid/:answerid', async (req, res) => {
    const id = req.params.answerid;
    try {
        const answert = await dbService.getAnswerById(id);
        console.log(answert)
        res.send(answert);
    }
    catch (error) {
        res.send('something wrong getting single answer with id')
    }
});


routes.put('/upvote', async (req, res) => {
    const id = req.body.id;
    try {

        const test = await dbService.upVoteQ(id);
        res.json(id);

    } catch (error) {
        res.send(error);
    }
});

routes.put('/downvote', async (req, res) => {
    const id = req.body.id;
    try {

        const test = await dbService.downVoteQ(id);
        res.json(id);

    } catch (error) {
        res.send(error);
    }
});

routes.put('/answer/upvote', async (req, res) => {
    const id = req.body.aid;
    try {


        const upvote = await dbService.upVoteA(id);
        res.json(upvote);

    } catch (error) {
        res.send(error);
    }
});

routes.put('/answer/downvote', async (req, res) => {
    const id = req.body.aid;
    try {
        const test = await dbService.downVoteA(id);
        res.json(test);
    } catch (error) {

        res.send(error);
    }
});


routes.delete('/user/:userid', async (req, res) => {
    const id = req.params.userid;
    try {
        const del = await dbService.deleteUser(id);
        res.send("user delete");
    }
    catch (error) {
        throw new Error("something went wrong when deleting");
    }

});

routes.delete('/answer/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const del = await dbService.deleteAnswer(id);
        res.send("answer delete");
    }
    catch (error) {
        throw new Error("something went wrong when deleting");
    }

});

routes.put('/updatea/:answerid', async (req, res) => {
    const kId = req.params.answerid;
    try {

        const found = await dbService.getAnswerById(kId);
        if (found) {
            await dbService.updateAnswer(kId, req.body);
            res.send({ SUCCESS: `answer with the id: ${kId} updated` });
        } else {
            res
                .status(400)
                .send({ ERROR: `dosent exist` });
        }
    } catch (error) {
        res.send(error);
    }
});

routes.delete('/user/:id', async (req, res) => {

    const id = req.params.id;
    try {
        const del = await dbService.deleteUser(id);
        res.send("user delete");
    }
    catch (error) {
        throw new Error("something went wrong when deleting");
    }

});

routes.put('/duplicate/', async (req, res) => {
    const id = req.body.lid;
    try {

            const duplicate = await dbService.isDuplicate(id);
            res.json(id);

    } catch (error) {
        res.send(error);
    }
});

routes.get('/answerstest2/:answerid', async (req, res) => {
    const id = req.params.answerid;
    
    try {

        const answers = await dbService.getAnswerstest2(id);
        res.send(answers);
    }
    catch (error) {
        res.send("something wrong with getting answer")
    }
});

routes.put('/blockuser/:userid', async (req,res)=>{
    const userid = req.params.userid;
    try{
            const blockuser = await dbService.blockU(userid);
            res.send("Ok")
    }
    catch(error){
        res.send(error);
    }
});

routes.put('/unblockuser/:userid', async (req,res)=>{
    const userid = req.params.userid;
    try{
            const unblockuser = await dbService.unblockU(userid);
            res.send("Ok")
    }
    catch(error){
        res.send(error);
    }
});



const genPass = async (pwd) => {
    const salt = await bcrypt.genSalt(saltrounds);
    const hash = await bcrypt.hash(pwd, salt);

    return hash;
};

const comparePass = async (pwd, hash) => {
    const match = await bcrypt.compare(pwd, hash);

    return match;
};



module.exports = routes;