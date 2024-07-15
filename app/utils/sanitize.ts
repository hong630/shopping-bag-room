
// 스크립트 태그, HTML 태그 제거 (XXS 방어)
async function sanitizeValue(value:string) {
    return value.replace(/<script.*?>.*?<\/script>/gi, '')
        .replace(/<.*?>/g, '');
}

// 이메일 형식 검사 함수
async function validateEmail(value:string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}


// 비밀번호 형식 검사 함수
async function validatePassword(value:string) {
    const lengthPattern = /^.{8,}$/; // 비밀번호가 최소 8자 이상인지 확인
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // 특수문자 포함 여부 확인
    const emojiPattern = /[\uD83C-\uDBFF\uDC00-\uDFFF]/; // 이모지 검사

    if (!lengthPattern.test(value)) {
        return false; // 비밀번호가 8자 이상이 아님
    }

    if (!specialCharPattern.test(value)) {
        return false; // 특수문자가 포함되어 있지 않음
    }

    if (emojiPattern.test(value)) {
        return false; // 이모지가 포함되어 있음
    }

    return true; // 유효한 비밀번호
}

async function checkOver(value:string, limit:number){
    if (value.length > limit) {
        return false; // 입력값이 {limit}자 이상임
    }
    return true;
}


export {sanitizeValue, validateEmail, validatePassword, checkOver}
