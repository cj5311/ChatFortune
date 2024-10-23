// 'openai' 모듈을 불러옵니다. OpenAI API에 접근하기 위한 SDK입니다.
const OpenAI = require('openai');

// OpenAI 객체를 생성합니다. 여기서 API 키를 제공하여 OpenAI API에 접근 권한을 인증합니다.
// 'apiKey'는 OpenAI API에 요청을 보낼 때 필요한 비밀 키입니다.
const openai = new OpenAI({
  apiKey: "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",
});

// 비동기 함수 'main'을 선언합니다. 비동기 함수는 내부에서 'await'를 사용하여 비동기 작업이 완료될 때까지 기다리도록 합니다.
async function main() {
  // OpenAI의 'chat.completions.create' 메서드를 호출하여, ChatGPT 모델에게 요청을 보냅니다.'await' 키워드를 사용하여 API 요청이 완료될 때까지 기다립니다.
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
  console.log(completion.choices);
}
main();
