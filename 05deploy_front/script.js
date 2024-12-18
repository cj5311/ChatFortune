const TOSS_URL = "https://buymeacoffee.com/cj5311";
const server_url = "https://budaw7qe22kjtl6l3jgmhgp2dq0wkvnj.lambda-url.ap-northeast-2.on.aws/fortuneTell"
// const server_url = "http://localhost:3000/fortuneTell"

// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myDateTime = '';
let threadId = [""];

document.addEventListener('DOMContentLoaded', () => {
    
    const video = document.getElementById('background-video');

    if (video) {
        const snapshotImg = document.getElementById('video-snapshot');

        // 비디오 첫 프레임을 캡처
        video.addEventListener('loadeddata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // 비디오 첫 프레임을 캔버스에 그리기
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 캔버스 이미지를 <img> 태그에 설정 (스냅샷 생성)
            snapshotImg.src = canvas.toDataURL('image/png');
            snapshotImg.style.display = 'block';
            video.style.display = 'none'; // 비디오는 처음에 숨기기
        });

        // 비디오가 준비되면 스냅샷을 숨기고 비디오를 표시
        video.addEventListener('canplaythrough', () => {
            snapshotImg.style.display = 'none'; // 스냅샷 숨기기
            video.style.display = 'block'; // 비디오 표시
            video.play(); // 비디오 재생
        });
    } else {
        console.error('Video element not found');
    }
});


function start() {
    const date = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    if (date === '') {
        alert('생년월일을 입력해주세요.');
        return;
    }
    myDateTime = date + hour;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";
}

async function sendMessage() {
    //로딩 아이콘 보여주기
    document.getElementById('loader').style.display = "block";

    //사용자의 메시지 가져옴
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    //채팅 말풍선에 사용자의 메시지 출력
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.textContent = message;
    document.getElementById('fortuneResponse').appendChild(userBubble);

    //Push
    // userMessages.push(messageInput.value);

    //입력 필드 초기화
    messageInput.value = '';

    //백엔드 서버에 메시지를 보내고 응답 출력
    try {


        const response = await fetch(server_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                myDateTime: myDateTime,
                userMessage: message,
                threadId: threadId.at(-1),
            })
        });


        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }

        const data = await response.json();

        //로딩 아이콘 숨기기
        document.getElementById('loader').style.display = "none";

        //Push
        assistantMessages.push(data.assistant);
        threadId.push(data.threadId);
        console.log('Response:', data);

        
        localStorage.setItem('threadId', threadId);  // threadId를 localStorage에 저장

        //채팅 말풍선에 챗GPT 응답 출력
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = data.assistant;
        
        //후원 링크 삽입
        const p = document.createElement('p');
        p.innerHTML = '추가로 링크를 눌러 작은 정성 베풀어 주시면 더욱 좋은 운이 있으실 겁니다. => ';
        const link = document.createElement('a');
        link.href = TOSS_URL;
        link.innerHTML = '복채 보내기'
        p.appendChild(link);
        botBubble.appendChild(p);

        document.getElementById('fortuneResponse').appendChild(botBubble);


    } catch (error) {
        console.error('Error:', error);
    }
}