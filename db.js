const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');


const dbPromise = (async () => {
    return open({
        filename: './databas.db',
        driver: sqllite3.Database
    });
})();


//addin a consumer
const addUser = async (data, hashpass) => {
    try {
        const dbConnection = await dbPromise;
        const response = await dbConnection.run("INSERT INTO users (email,firstname,lastname,username,password,userlevel) VALUES(?,?,?,?,?,1)", [data.email, data.firstname, data.lastname, data.username, hashpass]);
        return { status: 'ok', user:response };
    } 
    catch (error) {
        throw new Error("Gick ej att lägga till en consumer");
    }
};

//Get all the consumers
const getUsers = async () => {
    try {
        const dbConnection = await dbPromise; 
        const consumers = await dbConnection.all('SELECT firstname, lastname, email, userlevel, username, isblocked, userid FROM users ORDER BY firstname ASC')
        return consumers;
    }
    catch (error) {
        throw new Error('Något gick fel');
    }
};


const getUser = async (username) => {
    try {
        const dbConnection = await dbPromise;
        const consumer = await dbConnection.all('SELECT firstname, lastname, username, email, password, userlevel, picture, isblocked, userid FROM users WHERE username=?', [username])
        return consumer;
    }
    catch (error) {
        throw new Error('Något gick fel');
    }
};

const getUserCredentials = async (username) => {
    try {
        const dbConnection = await dbPromise;
        const consumer = await dbConnection.get('SELECT email, firstname, lastname, username, password, picture, userlevel, isblocked, userid FROM users WHERE username=?', [username])
        return consumer;
    }
    catch (error) {
        throw new Error('Något gick fel2');
    }
};



//COMPARE PASSWORD WITH HASHED PASSWORD
const comparePass = async (pwd, hash) => {
    const match = await bcrypt.compare(pwd, hash);
    return match;
       
};








//Get questions
const getQuestions = async () => {
    try {
        const dbConnection = await dbPromise;
        const questions = await dbConnection.all('SELECT title, text, category, id, duplicate, userid, created_at FROM questions ORDER BY title ASC');
        return questions;
    }
    catch (error) {
        throw new Error('something went wrong');
    }
};


const addQuestion = async (data) => {
    try {

        const dbConnection = await dbPromise;
        await dbConnection.run("INSERT INTO questions (title, text, category, userid, duplicate) VALUES(?, ?, ?, ?, 1)", [data.title, data.text, data.category, data.userid]);
        return { status: 'ok' };
    }
    catch (error) {
        throw new Error('something wrong with posting message database');

    }
};
const addAnswer = async(data) => {
    try{
            const dbConnection = await dbPromise;
            await dbConnection.run("INSERT INTO answers (comment, questionidforanswer, userid) VALUES (?,?,?)", [data.comment, data.questionidforanswer, data.userid]);
            return{status: 'ok'};
    }
    catch (error){
        throw new Error('Something went wrong.')
    }
};

const getAnswerByIdQuestioniforanswer = async (answerid) => {

    try {

        const dbConnection = await dbPromise;
        const answer = await dbConnection.all('SELECT comment, anupVote, andownVote, answerid, userid, questionidforanswer, created_at FROM answers WHERE questionidforanswer = ?', [answerid]);
        return answer;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};

const getAnswerById = async (data) => {

    try {

        const dbConnection = await dbPromise;
        const answerid = await dbConnection.all('SELECT comment, anupVote, andownVote, answerid, questionidforanswer, userid FROM answers WHERE answerid = ?', [data]);
        return answerid;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};

const getAnswers = async () => {
    try {
        const dbConnection = await dbPromise;
        const answers = await dbConnection.all('SELECT comment, anupVote, andownVote, questionidforanswer, userid, answerid, created_at FROM answers');
        return answers;
    }
    catch (error) {
        throw new Error('something went wrong');
    }
};

const getMessageByTitle = async (title) => {
    try {
        const dbConnection = await dbPromise;
        const questions = await dbConnection.get('SELECT title, text, category, id, questionownerpicture, questionownerusername FROM questions WHERE title = ?', [title]);
        return questions;

    }
    catch (error) {
        throw new Error(error);
    }

};

const updateUserPicture = async (userid, picture) => {
    console.log(userid, picture)
    try {
        const dbConnection = await dbPromise;
        const consumer = await dbConnection.get('UPDATE users SET picture = ? WHERE userid = ?', [picture, userid]);
    }
    catch (error) {
        throw new Error('something wrong update picture');
    }
};

//LOG IN, GET A USER BY USERNAME
const doLogin = async (data) => {
    try {
        const dbConnection = await dbPromise;
        const user = await dbConnection.get("SELECT password FROM users WHERE username= ?", [data.username]);
        return user;
    } catch (error) {
        throw error;

    }
};

const getContributors = async (data) => {
    try {
        const dbConnection = await dbPromise;
        const contributors = await dbConnection.all("SELECT email, firstname, lastname,username, password, id, userlevel FROM users WHERE userlevel = 2", [data.userlevel]);
        return contributors;
    }
    catch (error) {
        throw new Error('something went wrong');
    }
};


const getQuestionById = async (data) => {

    try {

        const dbConnection = await dbPromise
        const question = await dbConnection.all("SELECT title, text, category, id, userid, created_at FROM questions WHERE id = ?", [data]);
        return question;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};

const getCategories = async (data) => {

    try {

        const dbConnection = await dbPromise;
        const question = await dbConnection.all("SELECT title, text, category, userid, created_at, id FROM questions WHERE category = ? ", [data]);
        return question;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};

const getAllCategories = async () => {

    try {

        const dbConnection = await dbPromise;
        const question = await dbConnection.all("SELECT title, text, category, userid, created_at, id FROM questions");
        return question;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};
const deleteQuestion = async (id) => {
    try {
        const dbConnection = await dbPromise;
        await dbConnection.run('DELETE FROM questions WHERE id = ?', [id])
        return { status: 'ok' };
    }
    catch (error) {
        throw new Error('something went wrong removing')
    }
};

const deleteAnswer = async (answerid) =>{
    try{
        const dbConnection = await dbPromise;
        await dbConnection.run('DELETE FROM answers WHERE answerid = ?',[answerid])
        return { status: 'ok'};
    }
    catch(error)
    {
        throw new Error('something went wrong removing')
    }
};

const deleteUser = async (userid) =>{
    try{
        const dbConnection = await dbPromise;
        await dbConnection.run('DELETE FROM users WHERE userid = ?',[userid])
        return { status: 'ok'};
    }
    catch(error)
    {
        throw new Error('something went wrong removing')
    }
};

const updateQuestion = async (id, data) => {
    try {

        const dbConnection = await dbPromise;
        const questions = await dbConnection.get('UPDATE questions SET title = ?, text = ?, category = ? WHERE id = ?', [data.title, data.text, data.category, id]);
        console.log("htest");
        return questions;
    } catch (err) {
        throw new Error(error);
    }
};
//ta bort?
const addContributor = async (data) => {
    try {
        const dbConnection = await dbPromise;
        await dbConnection.run("INSERT INTO contributors(email, firstname, lastname, password) VALUES(?,?,?,?)", [data.email, data.firstname, data.lastname, data.password]);
        return { status: "okidoki" };
    }
    catch (error) {
        throw new Error(error);
    }
};

const getcontributorById = async (userid) => {

    try {

        const dbConnection = await dbPromise
        const contributor = await dbConnection.get("SELECT email, firstname, lastname, username, userlevel, isblocked, userid FROM users WHERE userid = ?", [userid]);
        return contributor;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};


const getuserById = async (data) => {

    try {

        const dbConnection = await dbPromise
        const contributor = await dbConnection.all("SELECT email, firstname, lastname, picture, username, userlevel, isblocked, userid FROM users WHERE userid = ?", [data]);
        return contributor;
    }
    catch (error) {
        throw new Error('something went wrong')
    }
};

const updateContributor = async (userid, data) => {
    try {

        const dbConnection = await dbPromise;
        const contributors = await dbConnection.all('UPDATE users SET email = ?, firstname = ?, lastname = ?, username = ?, userlevel = ?  WHERE userid = ?', [data.email, data.firstname, data.lastname, data.username, data.userlevel,userid]);
        console.log("hst");
        return contributors;
    } catch (err) {
        throw new Error(error);
    }
};

const updateAnswer = async (answerid, data) => {
    try {

        const dbConnection = await dbPromise;
        const answers = await dbConnection.get('UPDATE answers SET comment = ? WHERE answerid = ?', [data.comment, answerid]);
        console.log("hst");
        return answers;
    } catch (err) {
        throw new Error(error);
    }
};

const upVoteQ = async (id) => {
    try{
        const dbConnection = await dbPromise;
        const upvote = await dbConnection.run('UPDATE questions SET upVote = upVote +1 WHERE id = ?',[id])
        return { status: "okidoki" };
    } catch (err) {
        throw new Error(error);
}
};

const downVoteQ = async (id) => {
    try{
        const dbConnection = await dbPromise;
        const dvote = await dbConnection.run('UPDATE questions SET downVote = downVote -1 WHERE id = ?',[id])
        return { status: "okidoki" };
    } catch (err) {
        throw new Error(error);
}
};

const upVoteA = async (answerid) => {
    try{
        const dbConnection = await dbPromise;
        const upvote = await dbConnection.run('UPDATE answers SET anupVote = anupVote + 1 WHERE answerid = ?', [answerid])
        return { status: "okidoki" };
    } catch (err) {
        throw new Error(error);
}
};

const downVoteA = async (answerid) => {
    try{
        const dbConnection = await dbPromise;
        const dvote = await dbConnection.run('UPDATE answers SET andownVote = andownVote -1 WHERE answerid = ?',[answerid])
        return { status: "okidoki" };
    } catch (err) {
        throw new Error(error);
}
};

const isDuplicate = async (id) => {
    try{
        const dbConnection = await dbPromise;
        const duplicate = await dbConnection.run('UPDATE questions SET duplicate = 2 WHERE id = ?', [id])
        return { status: "okidoki" };
    } catch (err) {
        throw new Error(error);
}
};



const getAnswerstest2 = async (answerid) => {
    try {
        const dbConnection = await dbPromise;
        const answers = await dbConnection.all('SELECT questionidforanswer FROM answers WHERE answerid = ?', [answerid]);
        return answers;
    }
    catch (error) {
        throw new Error('something went wrong');
    }
};

const blockU =  async (userid) => {
    try{
        const dbConnection = await dbPromise;
        const block = await dbConnection.run('UPDATE users SET isblocked = 1 WHERE userid = ?' ,[userid]);
        
    }
    catch(error){
        throw new Error('Something went wrong');
    }
};

const unblockU =  async (userid) => {
    try{
        const dbConnection = await dbPromise;
        const block = await dbConnection.run('UPDATE users SET isblocked = 0 WHERE userid = ?' ,[userid]);
        
    }
    catch(error){
        throw new Error('Something went wrong');
    }
};




module.exports = {
    getQuestions : getQuestions,
    addQuestion : addQuestion,
    getMessageByTitle : getMessageByTitle,
    addUser : addUser,
    getUsers: getUsers,
    getUser : getUser,
    updateUserPicture : updateUserPicture,
    doLogin : doLogin,
    getQuestionById : getQuestionById,
    deleteQuestion : deleteQuestion,
    updateQuestion : updateQuestion,
    getContributors : getContributors,
    addContributor : addContributor,
    getcontributorById : getcontributorById,
    updateContributor : updateContributor,
    comparePass : comparePass,
    getAnswers : getAnswers,
    addAnswer : addAnswer,
    upVoteQ : upVoteQ,
    downVoteQ : downVoteQ,
    upVoteA : upVoteA,
    downVoteA : downVoteA,
    getAnswerByIdQuestioniforanswer : getAnswerByIdQuestioniforanswer,
    getAnswerById : getAnswerById,
    getCategories : getCategories,
    deleteUser : deleteUser,
    updateAnswer : updateAnswer,
    getAllCategories : getAllCategories,
    getUserCredentials : getUserCredentials,
    deleteAnswer : deleteAnswer,
    isDuplicate : isDuplicate,
    getAnswerstest2 : getAnswerstest2,
    blockU : blockU,
    unblockU : unblockU,
    getuserById : getuserById

    

    
};



