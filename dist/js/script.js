window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    }

    function showTabContent(tab = 0) {
        tabsContent[tab].classList.add('show', 'fade');
        tabsContent[tab].classList.remove('hide');
        tabs[tab].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })

    //Timer

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds;

        const timeDifference = Date.parse(endTime) - Date.parse(new Date());

        if (timeDifference <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((timeDifference / (1000 * 60)) % 60),
            seconds = Math.floor((timeDifference / 1000) % 60);
        }

        return {
            'total': timeDifference,
            days,
            hours,
            minutes,
            seconds
        }
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function getZero(num) {
            if (num >= 0 && num < 10) {
                return `0${num}`
            } else {
                return num;
            }
        }

        function updateClock() {
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total < 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', '2023-05-20');

    // Modal

    const modalOpenBtn = document.querySelectorAll('[data-modal]'),
          modalCloseBtn = document.querySelectorAll('[data-close]'),
          modal = document.querySelector('.modal');

    modalOpenBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.toggle('hide');
            document.body.style.overflow = 'hidden';
        })
    })

    function closeModal() {
        modal.classList.toggle('hide');
        document.body.style.overflow = '';
    }

    modalCloseBtn.forEach(close => {
        close.addEventListener('click', closeModal)
    })

    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape' && !modal.classList.contains('hide')) {
            closeModal();
        }
    })
});