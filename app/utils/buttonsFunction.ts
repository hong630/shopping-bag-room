import React from "react";

//input 비밀번호 노출/숨김 기능
const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const closestPasswordInput = button.closest('form')?.querySelector('input[name="password"]');

    if (closestPasswordInput && closestPasswordInput instanceof HTMLInputElement) {
        if (closestPasswordInput.type === 'password') {
            closestPasswordInput.type = 'text';
        } else {
            closestPasswordInput.type = 'password';
        }
    }
};

export {togglePasswordVisibility}