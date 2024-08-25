// 현재 도메인을 가져오는 함수

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }else{
        return '';
    }
}
function getWsUrl() {
    if (typeof window !== 'undefined') {
        const { protocol, hostname } = window.location;
        const wsProtocol = protocol === 'https:' ? 'wss' : 'ws';
        const port = hostname === 'localhost' ? ':3001' : ':8000'; // 개발 환경에서는 포트 번호 추가
        return `${wsProtocol}://${hostname}${port}`;
    } else {
        return '';
    }
}
export {getBaseUrl, getWsUrl};