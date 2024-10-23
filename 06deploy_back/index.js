const OpenAI = require('openai');
const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors')

const path = require('path');
const {FRONT_URL, OPENAI_API} = require(path.join(__dirname, 'config.js'));

const openai = new OpenAI({
    apiKey: OPENAI_API,
});

//express 설정
const app = express()

//CORS 문제 해결
let corsOptions = {
    origin: FRONT_URL,
    credentials: true
}
// app.use(cors(corsOptions));
app.use(cors());

//POST 요청 받을 수 있게 만듦
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });


//POST 요청
app.post('/fortuneTell', async function (req, res) {

    //프론트엔드에서 보낸 메시지 출력
    let { myDateTime, userMessage, threadId } = req.body;
    console.log("threadId : ",threadId)
    console.log("userMessage : ",userMessage)

    // 어시스턴트는 웹에서 생성하여 어시스턴트 아이디만 가져옴.
    let assistantId = "asst_iUhOVNOJppbIulF6pq7vIPXc";

    // 쓰레드가 없다면 생성해 주고 기초 메세지를 쓰레드에 추가한다.
    if (threadId == ""){
       
        const thread = await openai.beta.threads.create();
        threadId = thread.id
        userMessage= `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`
    }

    console.log(userMessage)
    console.log("threadId : ",threadId)

    //쓰레드가 있는 경우, 메세지를 쓰레드에 추가해 준다.
    await openai.beta.threads.messages.create(threadId,
      {
        role: "user", 
        content: userMessage
      });

    //  메세지 추가 후, 쓰레드를 런 시켜준다.  
    // 이때 run이 비동기함수이기 때문에, await 함수로 요청이 끝날때까지 기다리고 polling기능을 통해 지속적으로 api 요청을 통해 상태를 반환한다.
    let run = await openai.beta.threads.runs.createAndPoll(
        threadId,
        { 
          assistant_id: assistantId,
          instructions: "Please use formal language. The user has a premium account."
        }
      );
    
    let messages ; 
    let message ; 


    if (run.status === 'completed') {
      // 쓰레드에 담긴 메시지들 출력
      messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      for (message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
    } else {
      console.log(run.status);
    }

    const assistant_message = messages.data.at(-1).content[0].text.value
    res.json({ "assistant": assistant_message , "threadId" : threadId });
});

app.listen(3000)
// 서버리스형태로 서버 구동 설정
// module.exports.handler = serverless(app)