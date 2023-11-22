export function addLeadingZeros (number, amountHouses = 2) {
    let string = String(number)
    let numberWithZeros = null
    let partDecimal = null
    let index =  0

    if (string.includes('.')) {
        index = string.indexOf('.')
        partDecimal = string.slice(index)
        numberWithZeros = string.slice(0, index)
    } else {
        numberWithZeros = string
    }

    while (numberWithZeros.length < amountHouses) numberWithZeros = "0" + numberWithZeros

    if (partDecimal) numberWithZeros += decimal

    return numberWithZeros
}

export function fromNumberToMonetary (number) {
    return number.toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})
}

export function fromCurrencyToNumber (string) {
    let regex = new RegExp(`[.]`, 'g')
    return Number(string.replace(regex, '').replace(`,`, '.'))
}

