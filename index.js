document.addEventListener('DOMContentLoaded', () => {
    const n = id => document.getElementById(id),
        [nicknameInput, passwordInput, card1, card2, chatBox, messageInput, imageUploadInput] =
        ['nickname', 'password', 'card', 'card2', 'chat', 'message', 'imageupload'].map(n);
    let observer;

    const login = async () => {
        if (nicknameInput.value && passwordInput.value) {
            const { success } = await (await fetch('verify_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput.value })
            })).json();
            if (success) {
                card1.hidden = true;
                card2.hidden = false;
                loadMessages();
                observer?.disconnect();
                observer = null;
                setInterval(loadMessages, 5e3);
            }
        }
    };

    /*const login = async () => {
        if (nicknameInput.value && passwordInput.value === '1') {
            card1.hidden = true;
            card2.hidden = false;
            loadMessages();
            observer?.disconnect();
            observer = null;
            setInterval(loadMessages, 5e3);
        }
    };*/

    const loadMessages = async () => {
        const s = chatBox.scrollHeight <= chatBox.clientHeight + chatBox.scrollTop + 1;
        chatBox.innerHTML = (await (await fetch('chat.php')).json()).map(m =>
            `<div><strong>${m.nickname}:</strong> ${m.content}${m.type !== 'text' ? `<br><img src="${m.image}" style="width:16%">` : ''}</div>`
        ).join('');
        s && (chatBox.scrollTop = chatBox.scrollHeight);
    };

    const sendMessage = async () => {
        const c = messageInput.innerHTML.trim();
        if (!c) return;
        const fd = new FormData();
        fd.append('nickname', nicknameInput.value);
        fd.append('content', c);
        fd.append('type', 'text');
        (await fetch('send_message.php', { method: 'POST', body: fd })).ok &&
            (messageInput.innerHTML = '', loadMessages());
    };

    /*const handleImageUpload = () => {
        const f = imageUploadInput.files[0];
        if (f?.size <= 666 * 1024) {
            const r = new FileReader();
            r.onload = e => messageInput.innerHTML += `<img src="${e.target.result}" style="width:16%">`;
            r.readAsDataURL(f);
        }
    };*/

    const handleImageUpload = () => {
        const [file] = imageUploadInput.files;
        if (!file) return;
        const r = new FileReader();
        r.onload = e => {
            const img = new Image();
            img.onload = () => file.size > 666 * 1024
                ? compressImage(img, displayImage)
                : displayImage(img.src);
            img.src = e.target.result;
        };
        r.readAsDataURL(file);
    };

    const compressImage = (img, cb, q = 1) => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        c.toBlob(b => b.size <= 666 * 1024 || q <= 0.1
            ? (r => (r.onload = () => cb(r.result), r.readAsDataURL(b)))(new FileReader())
            : compressImage(img, cb, q - 0.1), 'image/jpeg', q);
    };

    const displayImage = src => messageInput.innerHTML += `<img src="${src}" style="width:16%">`;

    ['login', 'insertimage', 'sendmessage'].forEach((id, i) =>
        n(id).addEventListener('click', [login, () => imageUploadInput.click(), sendMessage][i])
    );
    imageUploadInput.addEventListener('change', handleImageUpload);

    (() => { if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) document.body.innerHTML = ""; })();

    const ih = window.innerHeight, iw = window.innerWidth;
    window.onresize = () => { if (ih !== window.innerHeight || iw !== window.innerWidth) setTimeout(() => location.reload(), 1000); };

    if (window.MutationObserver) {
        observer = new MutationObserver(() => location.reload());
        observer.observe(document, { attributes: true, childList: true, characterData: true, subtree: true });
    }

});