export function scrollToElement (idElement, idContainer = null) {
    let element = document.getElementById(idElement)
    if (idContainer) {
        let container = document.getElementById(idContainer)
        let relativeOffsetTop = element.offsetTop - container.offsetTop
        if (relativeOffsetTop >= 0) {
            container.scrollTo({top: (relativeOffsetTop - element.clientHeight), behavior: 'smooth'})
        } else {
            container.scrollTo({top: (relativeOffsetTop), behavior: 'smooth'})
        }
    } else {
        window.scrollTo({top: element.offsetTop, behavior: 'smooth'})
    }
}

export function reportEmptyInput (idElement) {
    document.getElementById(idElement).animate(
        [
            { border: '1.5px solid #8f8f9d', boxShadow: 'none', offset: 0 },
            { transform: 'translateX(0)', offset: 0.35 }, 
            { transform: 'translateX(-3%)', offset: 0.41 }, 
            { transform: 'translateX(3%)', offset: 0.47 }, 
            { borderColor: '#f10002', boxShadow: '0px 0px 2px #f10002', offset: 0.5 }, 
            { transform: 'translateX(-3%)', offset: 0.53 }, { transform: 'translateX(3%)', offset: 0.59 }, 
            { transform: 'translateX(0)', offset: 0.65 }, 
            { border: '1.5px solid #8f8f9d', boxShadow: 'none', offset: 1 }
        ],{
            duration: 1500,
            easing: 'ease-in-out'
        }
    )
}