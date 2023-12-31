const runBtn = document.querySelector('.run-btn')
runBtn.addEventListener('click', () => {
    data = editor.innerText
    countInputs = (data.match(/input/g) || []).length
    for (let i = 0; i < countInputs; i++) {
        promptString = data.match(/input\((.*?)\)/)[1].replace(/"/g, '').replace(/\'/g, '')
        data = data.replace(/input(.+?)\)/, '"'+prompt(promptString)+'"')
    }
    ajaxPost('/sendCode', { data }).then(data => output.innerHTML = data.replace(/\n/g, '<br>'))
})

const themeBtn = document.querySelector('.theme-btn')
themeBtn.onclick = () => {
    if (themeBtn.classList.contains('dark')) {
        document.documentElement.style.setProperty('--secondary-color', '#1a1a1a')
        document.documentElement.style.setProperty('--main-color', '#ffffff')
        themeBtn.innerHTML = '<img src="theme_light.svg" alt="theme" class="header-btn_img">'
        document.querySelector('.github-btn').innerHTML = '<img src="github_light.svg" alt="theme" class="header-btn_img">'
    }
    else {
        document.documentElement.style.setProperty('--secondary-color', '#ffffff')
        document.documentElement.style.setProperty('--main-color', '#1a1a1a')
        themeBtn.innerHTML = '<img src="theme_dark.svg" alt="theme" class="header-btn_img">'
        document.querySelector('.github-btn').innerHTML = '<img src="github_dark.svg" alt="theme" class="header-btn_img">'
    }
    themeBtn.classList.toggle('dark')
}

const clearBtn = document.querySelector('.clear-btn')
clearBtn.onclick = () => output.textContent = ''

const toFileBtn = document.querySelector('.to-file-btn')
toFileBtn.onclick = () => {
    const link = document.createElement('a')
    const file = new Blob([editor.innerText], { type: "text/plain "});
    link.download = String(Math.random().toString(16).slice(2)) + ".py"
    link.href = URL.createObjectURL(file)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const searchBtn = document.querySelector('.search-btn')
searchBtn.onclick = () => {
    window.open(`https://yandex.ru/search/?text=${output.innerText}`, '_blank')
}

const output = document.querySelector('.console_output')

const lang = {
    python: {
        equa: /(\b=\b)/g,
        quot: /(('''|"|').*?('''|"|'))/g,
        comm: /(#[^<]+)/g,
        logi: /(%=|%|\-|\+|\*|&amp;{1,2}|\|{1,2}|&lt;=|&gt;=|&lt;|&gt;|!={1,2}|={2,3})/g,
        numb: /(\d+(\.\d+)?(e\d+)?)/g,
        oper: /\b(def|class(?!\s*\=)|continue|break|for|in|is|as|if|elif|else|and|or|True|False|None|pass|del|except|finally|try|from|global|not|notlocal|lambda|raise|return|while|with|yeild|await|async|assert)(?=\b)/g,
        func: /(\w+\()/g,
        pare: /(\(|\))/g,
        squa: /(\[|\])/g,
        curl: /(\{|\})/g,
    }
}

const editor = document.querySelector('.editor')
const lastSave = localStorage.getItem('onlinePythonSave')
if (lastSave) editor.innerHTML = lastSave
const numbersContainer = document.querySelector('.numbersContainer')

editor.contentEditable = true
editor.spellcheck = false
editor.autocorrect = "off"
editor.autocapitalize = "off"
editor.addEventListener("input", () => highLite())
editor.addEventListener("keydown", event => {
    if (event.keyCode == 9) {
        document.execCommand('insertHTML', false, '    ');
        event.preventDefault();
    }
})

highLite()

function highLite() {
    const dataLang = editor.dataset.lang
    const langObj = lang[dataLang]

    let newEditorHTML = ''
    numbersContainer.innerHTML = ''
    if (editor.textContent.split("\n").length > 2) {
        for (let i = 0; i < editor.innerText.split("\n").length; i++) {
            newEditorHTML += "<div>" + (editor.innerText.split("\n")[i] || "<br>") + "</div>"
        }
        editor.innerHTML = newEditorHTML
    }

    let html = editor.innerHTML
    html = editor.innerHTML.replace(/<span(.+?)\;">/g, '').replace(/<\/span>/g, '')
    Object.keys(langObj).forEach(key => {
        if (key != "quot") html = html.replace(langObj[key], `<i class=${dataLang}_${key}>$1</i>`)
        else {
            let findExps = html.match(langObj[key]) || []
            findExps.forEach(findExp => {
                if (!findExp.includes("<div>") || findExp.includes("'''")) html = html.replaceAll(findExp, `<i class=${dataLang}_${key}>${findExp}</i>`)
            })
        }
    })
    editor.previousElementSibling.innerHTML = html

    const comsAndQuots = editor.previousElementSibling.querySelectorAll('.python_quot, .python_comm')
    comsAndQuots.forEach(el => el.innerHTML = el.textContent)
    
    for (let i = 1; i <= editor.querySelectorAll('div').length+1; i++) {
        numbersContainer.innerHTML += `<span class="num_editor">${i}</span>`
    }

    saveCode()
}

function saveCode() {
    localStorage.setItem('onlinePythonSave', editor.innerHTML)
}

// function removeFirstStr(str) {
//     return str.split('\n').slice(1).join('\n')
// }


