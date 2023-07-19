import React, { useState, useEffect } from 'react';
import ClipboardJS from 'clipboard';
import { v4 as uuidv4 } from 'uuid';

const generateRandomPassword = (length, includeNumbers, includeLetters, includeSpclChar) => {
    const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const spclchar = '!@#$%&*';

    let validChars = '';
    if (includeNumbers) validChars += numbers;
    if (includeLetters) validChars += alphabets;
    if (includeSpclChar) validChars += spclchar;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        password += validChars[randomIndex];
    }

    return password;
};

export const PasswordGenerator = () => {
    const [passwordLength, setPasswordLength] = useState(5);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeSpclChar, setIncludeSpclChar] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [prevPasswords, setPrevPasswords] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const generatePassword = () => {
        const password = generateRandomPassword(passwordLength, includeNumbers, includeLetters, includeSpclChar);
        if (passwordLength < 5) return
        setGeneratedPassword(password);

        const newPassword = {
            id: uuidv4(),
            value: password,
        };
        setPrevPasswords((prev) => [newPassword, ...prev.slice(0, 4)]);
        localStorage.setItem('prevPasswords', JSON.stringify([newPassword, ...prevPasswords.slice(0, 4)]));
    };
    const handleCopyToClipboard = (password) => {
        const clipboard = new ClipboardJS('.copy-to-clipboard', {
            text: function () {
                return password;
            },
        });
        clipboard.on('success', () => {
            setSnackbarOpen(true);
            clipboard.destroy();
        });
        clipboard.on('error', () => {
            console.error('Failed to copy the password to clipboard.');
            clipboard.destroy();
        });

        setTimeout(() => {
          setSnackbarOpen(false); 
        }, 2000);
    };

    useEffect(() => {
        const prevPasswordsFromStorage = JSON.parse(localStorage.getItem('prevPasswords'));
        if (prevPasswordsFromStorage) {
            setPrevPasswords(prevPasswordsFromStorage);
        }
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Random Password Generator</h1>
            <div className="form-group">
                <label>Password Length:</label>
                <input
                    type="number"
                    className="form-control"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                />
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
                <label className="form-check-label">Include Numbers</label>
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={includeLetters}
                    onChange={(e) => setIncludeLetters(e.target.checked)}
                />
                <label className="form-check-label">Include Letters</label>
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={includeSpclChar}
                    onChange={(e) => setIncludeSpclChar(e.target.checked)}
                />
                <label className="form-check-label">Include Special Character</label>
            </div>
            <button className="btn btn-primary mt-3" onClick={generatePassword}>
                Generate Password
            </button>
            <div className={`alert alert-danger mt-3  ${passwordLength < 5 ? 'd-block' : 'd-none'}`} role="alert">
                Length should be more than 5
            </div>
            {generatedPassword && (
                <>
                    <h3 className="mt-4">Generated Password:</h3>
                    <div className="input-group">
                        <input className="form-control" value={generatedPassword} readOnly />
                        <div className="input-group-append">
                            <button className="btn btn-secondary copy-to-clipboard" onClick={() => handleCopyToClipboard(generatedPassword)}>
                                Copy
                            </button>
                        </div>
                    </div>
                </>
            )}
            <h3 className="mt-4">Previous Passwords:</h3>
            <ul className="list-group mb-3">
                {prevPasswords.map((password) => (
                    <li key={password.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {password.value}
                        <button className="btn btn-secondary copy-to-clipboard" onClick={() => handleCopyToClipboard(password.value)}>
                            Copy
                        </button>
                    </li>
                ))}
            </ul>
            <div className={`alert alert-success mt-3 mb-3 ${snackbarOpen ? 'd-block' : 'd-none'}`} role="alert">
                Copied to clipboard !
            </div>
        </div>
    )
}
