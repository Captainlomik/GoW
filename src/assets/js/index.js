import '../styles/styles.scss';
import 'swiper/swiper.min.css';
import Swiper, {
    Navigation
} from 'swiper';
Swiper.use([Navigation])

import {
    languages
} from "./languages"

const classes = {
    opened: "opened",
    hidden: "hidden",
    active: "active"
}
let isPlay = false
const checkboxes = {
    requirements: ["minimum", "recommended"],
    versions: ["standard", "limited"]
}

const header = document.querySelector('.header')
const menuButton = document.querySelector('.header-menu__button')
const menuLink = document.querySelectorAll('.menu-link')
const video = document.querySelector('#video')
const videoButton = document.querySelector('.video-btn')
const checkbox = document.querySelectorAll('.checkbox')
const faqItem = document.querySelectorAll('.faq-item')
const sections = document.querySelectorAll('.section')
const language = document.querySelectorAll('.language')
const buyButton = document.querySelectorAll('.buy-button')
const modal = document.querySelector('.modal')
const modalTitle = document.querySelector('.modal-version')
const modalPrice = document.querySelector('.modal-total__price')
const modalClose = document.querySelector('.modal-close')
const overlay = document.querySelector('.overlay')
const values = [
    {
        price: 18.99,
        title: "PC Edition",
    }, 
    {
        price: 19.99,
        title: "Standard Edition Ps4, Ps5",
    },
    {
        price: 29.99,
        title: "Deluxe Edition (Ps5)",
    },
    {
        price: 35.99,
        title: "DualSense + game",
    },
];


/* Меню */
const toggleMenu = () => header.classList.toggle(classes.opened)
const scrollToSection = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href')

    if (!href && !href.starsWith('#')) return

    const section = href.slice(1)
    const top = document.getElementById(section).offsetTop
    window.scrollTo({
        top,
        behavior: 'smooth'
    })

}


/* Таймер */
function formatValue(value) {
    return value < 10 ? `0${value}` : value
}

function getTimerValues(diff) {
    return {
        seconds: (diff / 1000) % 60,
        minutes: (diff / (1000 * 60)) % 60,
        hours: (diff / (1000 * 60 * 60)) % 24,
        days: (diff / (1000 * 3600 * 24)) % 30,
    }
}

function startTimer(date) {
    setInterval(() => {
        const diff = new Date(date).getTime() - new Date().getTime()

        if (diff < 0) {
            clearInterval(id)
            return
        }
        Object.entries(getTimerValues(diff)).forEach(([key, value]) => {
            const timerValue = document.getElementById(key)
            timerValue.innerText = formatValue(Math.floor(value))
        })
    }, 1000)
}


/* Видео */
function handleVideo({
    target
}) {
    const info = target.parentElement
    isPlay = !isPlay
    info.classList.toggle(classes.hidden, isPlay)
    target.innerText = isPlay ? "Pause" : "Play"
    isPlay ? video.play() : video.pause()
}


/* Checkbox */
function handleCheckbox({
    currentTarget: {
        checked,
        name
    }
}) {
    const {
        active
    } = classes
    const value = checkboxes[name][Number(checked)]
    const list = document.getElementById(value)
    const tabs = document.querySelectorAll(`[data-${name}]`)
    const siblings = list.parentElement.children
    for (const item of siblings) {
        item.classList.remove(active)
    }

    for (const tab of tabs) {
        tab.classList.remove(active)
        tab.dataset[name] === value && tab.classList.add(active)
    }

    list.classList.add(active)
}


/* Cлайдер */
function initSlider() {
    new Swiper(".swiper", {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 20,
        initialSlide: 2,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    })
}

/* FAQ */
function handleFaqItem({
    currentTarget: target
}) {
    target.classList.toggle(classes.opened)
    const isOpened = target.classList.contains(classes.opened)
    const height = target.querySelector('p').clientHeight
    const content = target.querySelector('.faq-item__content')

    content.style.height = `${isOpened ? height : 0}px`
}

/* Появление элементов */
function handleScroll() {
    const {
        scrollY,
        innerHeight
    } = window
    sections.forEach(section => {
        if (scrollY > section.offsetTop - innerHeight / 1.5) section.classList.remove(classes.hidden)
    })

}

/* Смена Языка */
function setTexts() {
    const lang = localStorage.getItem('lang') || 'en'
    const content = languages[lang]

    Object.entries(content).forEach(([key, value]) => {
        const items = document.querySelectorAll(`[data-text="${key}"]`)
        items.forEach(item => {
            item.innerText = value
        })
    })
}


function toggleLanguage({
    target
}) {
    const {
        lang
    } = target.dataset

    if (!lang) return
    localStorage.setItem('lang', lang)
    setTexts()
}

/* Кнопка покупки */
function handleBuyButton({
    currentTarget: target
}) {
    const {
        value
    } = target.dataset

    if (!value) return
    const {
        price,
        title
    } = values[value]
    modalTitle.innerText = title
    modalPrice.innerText = price
    modal.classList.add(classes.opened)
    overlay.classList.add(classes.opened)
}

function closeModal() {
    modal.classList.remove(classes.opened)
    overlay.classList.remove(classes.opened)
}


setTexts()
initSlider()
startTimer("February 9, 2023 00:00:00")
menuButton.addEventListener('click', toggleMenu)
menuLink.forEach(link => {
    link.addEventListener('click', scrollToSection)
})
modalClose.addEventListener('click', closeModal)
videoButton.addEventListener('click', handleVideo)
checkbox.forEach(box => {
    box.addEventListener('click', handleCheckbox)
})
faqItem.forEach(item => {
    item.addEventListener('click', handleFaqItem)
})
window.addEventListener('scroll', handleScroll)
language.forEach(item => {
    item.addEventListener('click', toggleLanguage)
})
buyButton.forEach(btn => {
    btn.addEventListener('click', handleBuyButton)
})