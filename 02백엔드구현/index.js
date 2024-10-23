const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');


const openai = new OpenAI({
    apiKey: "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",
  });


// 'express' 모듈을 사용하여 'app' 객체를 생성합니다. 'app'은 서버 애플리케이션을 관리하는 Express 애플리케이션 인스턴스입니다.
const app = express();

// 'cors' 미들웨어를 사용하여 다른 도메인에서 이 서버에 접근할 수 있도록 허용합니다. Cross-Origin Resource Sharing(CORS) 문제를 해결하기 위한 설정입니다.
app.use(cors()) 

// JSON 형식의 요청 본문을 해석할 수 있도록 해주는 미들웨어를 등록합니다. 즉, 요청의 'body'가 JSON이라면 이를 JavaScript 객체로 변환합니다.
app.use(express.json()) 

// URL-encoded 형식의 요청 본문을 해석할 수 있도록 해주는 미들웨어입니다. HTML 폼 데이터 전송을 처리할 때 사용됩니다.
// 'extended: true'는 쿼리 문자열을 풍부한 객체로 파싱할 수 있게 해줍니다.
app.use(express.urlencoded({ extended: true })) 


app.post('/fortuneTell', async function (req, res) {
  // '/fortuneTell' 경로에 대해 POST 요청을 처리하는 핸들러 함수를 정의합니다. 이 함수는 비동기 함수로, OpenAI API 호출에서 'await'를 사용합니다.
  
  let messages = [{ 
    "role": "system", 
    "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 챗도지입니다." 
    },
    { "role": "user", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 챗도지입니다." 
    },
    { "role": "assistant", "content": "안녕하세요! 저는 챗도지입니다. 여러분에게 점성술과 운세에 관한 질문에 대해 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 드리겠습니다. 어떤 질문이든지 해주시면 최선을 다해 도와드리겠습니다." 
    }
  ]

  let { userMessages, assistantMessages } = req.body

  // userMessages나 assistantMessages 중 하나라도 남아 있을 때까지 반복하는 루프
  while((userMessages.length != 0) || (assistantMessages.length != 0)){
    // 'userMessages'가 비어있지 않으면
    if(userMessages.length != 0){
      messages.push(
        JSON.parse('{"role" : "user", "content" : "' + String(userMessages.shift().replace('/\n/g',"")) + '"}')
      )
    }
    
    // 'assistantMessages'가 비어있지 않으면
    if(assistantMessages.length != 0){
      messages.push(
        JSON.parse('{"role" :"assistant", "content" : "' + String(assistantMessages.shift().replace('/\n/g',"")) + '"}')
      )
    }
  };

  console.log(messages)
  // 최종적으로 완성된 'messages' 배열을 콘솔에 출력합니다.

  // OpenAI API를 호출하여 모델에게 대화를 보냄
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  let fortune = completion.choices[0].message['content'];

  console.log(fortune);

  res.json({"assistant": fortune });
  messages = []
});

app.listen(3000)
