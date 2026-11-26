// ==UserScript==
// @name         Video & Q&A Tools
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Advance video and copy questions/answers to clipboard
// @author       Real
// @match        *://elearning.set.or.th/*/enroll/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Advance Video Button ---
    const advanceBtn = document.createElement('button');
    advanceBtn.textContent = 'Advance Video';
    advanceBtn.style.position = 'fixed';
    advanceBtn.style.bottom = '20px';
    advanceBtn.style.left = '20px';
    advanceBtn.style.zIndex = '9999';
    advanceBtn.style.padding = '10px 15px';
    advanceBtn.style.backgroundColor = '#ff5722';
    advanceBtn.style.color = 'white';
    advanceBtn.style.border = 'none';
    advanceBtn.style.borderRadius = '5px';
    advanceBtn.style.cursor = 'pointer';
    advanceBtn.style.fontSize = '14px';
    advanceBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(advanceBtn);

    advanceBtn.addEventListener('click', () => {
        const video = Array.from(document.querySelectorAll('video'))
            .find(v => v.offsetParent !== null);
        if (!video) {
            alert('No visible video found!');
            return;
        }
        video.currentTime = Math.min(video.currentTime + 99999, video.duration);
        console.log(`[Video Advance] New time: ${video.currentTime.toFixed(2)}s`);
    });

    // --- Copy Q&A Button ---
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy Q&A';
    copyBtn.style.position = 'fixed';
    copyBtn.style.bottom = '20px';
    copyBtn.style.left = '160px';
    copyBtn.style.zIndex = '9999';
    copyBtn.style.padding = '10px 15px';
    copyBtn.style.backgroundColor = '#2196f3';
    copyBtn.style.color = 'white';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '5px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.fontSize = '14px';
    copyBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(copyBtn);

    copyBtn.addEventListener('click', () => {
        let output = '';
        const fieldsets = document.querySelectorAll('fieldset[id^="fieldset"]');

        fieldsets.forEach(fs => {
            const questionElem = fs.querySelector('h4');
            if (!questionElem) return;

            output += questionElem.textContent.trim() + '\n';

            const answers = fs.querySelectorAll('.answers-block .form-check-label');
            answers.forEach((ans, i) => {
                output += `  ${i + 1}. ${ans.textContent.trim()}\n`;
            });

            output += '\n';
        });

        if (output) {
            navigator.clipboard.writeText(output)
                .then(() => {
                    // Flash green background for 1 second
                    const originalColor = copyBtn.style.backgroundColor;
                    copyBtn.style.backgroundColor = '#4caf50';
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "Copied";
                    setTimeout(() => {
                        copyBtn.style.backgroundColor = originalColor;
                        copyBtn.textContent = originalText;
                    }, 500);
                })
                .catch(err => console.error('Copy failed:', err));
        } else {
            alert('No questions found!');
        }
    });

})();
