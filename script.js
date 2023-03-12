const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (message) => console.log(message);

const compose = (...fns) => 
    (arg) => 
        fns.reduce(
            (composed, f) => f(composed),
            arg
        )
// получает объект времени и возвращает объект
// для показания часов, содержащий часы, минуты и секунды
const serializeClockTime = date => 
({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
})

// получает объек показания часов и возвращает объект, где показания
// часов преобразуется к формату гражданского времени.
// Например 13:00 превращается в 1 час
const civilianHours = clockTime => 
({
    ...clockTime,
    hours: (clockTime.hours > 12) ? 
        clockTime.hours - 12 :
        clockTime.hours
})

// получает объект показания часов и добавляет к нему
// время суток, AM или PM
const appendAMPM = clockTime => 
({
    ...clockTime,
    ampm: (clockTime.hours >= 12) ? "PM" : "AM"
})

// ========================================================

// эти три функции используются для преобразования данный БЕЗ ИЗМЕНЕНИЯ
// исходного значения. В них изменения рассматриваются, как неизменяемые объекты.

// ========================================================

// получает функцию target и возвращает функцию, которая будет отправлять время в адрес цели.
// в данном примере цель будет только console.log
const display = target => time => target(time)

// получает шаблонную строку и использует ее для возвращения показания времени 
// отформатированного по критериям, заданным строкой. 
// В данном примере шаблон имеет вид hh:mm:ss tt
// Таким образо, formatClock будет заменять заполнители показаниями часов, минут, секунд и времени суток
const formatClock = format => 
    time => 
        format.replace("hh", time.hours)
        .replace("mm", time.minutes)
        .replace("ss", time.seconds)
        .replace("tt", time.ampm)

// получает в качестве аргумента ключ объекта и ставит нуль вререди занчения
// хранящегося под этим ключом объекта. Функция получает ключ к указанному полю
// и ставит перед значениями нуль, если значение меньше 10
const prependZero = key => clockTime =>
({
    ...clockTime,
    [key]: (clockTime < 10) ? 
        "0" + clockTime[key] : 
        clockTime[key]
})

// отдельная функция, получающая в качестве аргумента показания времени и преобразующая 
// его в формат гражданского времни с помощью обеих форм этого времени 
const convertToCivilianTime = clockTime => 
    compose(
        appendAMPM,
        civilianHours
    )(clockTime)

// отдельная функция, получающая в качестве аргумента показание времени и обеспечивающая 
// отображения часов, минут и секунд парой цифр, подставляя для этого 0, где это необходимо
const doubleDigits = civilianTime => 
    compose(
        prependZero("hours"),
        prependZero("minutes"),
        prependZero("seconds")
    )(civilianTime)
    
// запускает часы, устанавлявая интервал, вызывающий функцию обратного вызова каждую секунду
const startTicking = () =>  
    setInterval(
        compose(
            clear,
            getCurrentTime,
            serializeClockTime,
            convertToCivilianTime,
            doubleDigits,
            formatClock("hh:mm:ss tt"),
            display(log)
        ),
        oneSecond()
    )

startTicking();