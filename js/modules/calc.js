export class Calc {
    presentValue (value, rate, time) {
        return Number((value/Math.pow(1+rate, time)).toFixed(2))
    }

    VPL (rate, flow) {
        let vpl = 0
        for (let time = 0; time < flow.length; time++) vpl += this.presentValue(flow[time], rate, time)
        return Number(vpl.toFixed(2))
    }

    PBD (rate, flow) {
        let presentsValues = []
        let amortization = []

        for (let time = 0; time < flow.length; time++) presentsValues[time] = this.presentValue(flow[time], rate, time)

        for (let time = 0; time < presentsValues.length; time++) {

            amortization[time] = (time == 0) ? presentsValues[time] : amortization[time-1] + presentsValues[time]
    
            if (amortization[time] >= 0) {
                if (time == 0) {
                    return 0
                } else if (time == 1) {
                    return Number(-1*(presentsValues[0]/presentsValues[1]).toFixed(2))
                } else {
                    return Number((time-1+(-1*amortization[time-1]/presentsValues[time])).toFixed(2))
                }
            }       
        }
    
        return null
    }

    TIR(flow, accuracy = 0.00001, maxInteractions = 100) {
        // Newton-Raphson method

        let currentRate = 0.1;

        for (let i = 0; i < maxInteractions; i++) {
            let vpl = 0;
            let derivativeVPL = 0;

            for (let time = 0; time < flow.length; time++) {
                const discountFactor = 1 / Math.pow(1 + currentRate, time);

                vpl += flow[time] * discountFactor
                derivativeVPL -= time * flow[time] * discountFactor
            }

            const newRate = currentRate - vpl / derivativeVPL

            if (Math.abs(newRate - currentRate) < accuracy) return Number((newRate*100).toFixed(2))

            currentRate = newRate
        }
        return null
    }

    IL(rate, flow) {
        let initialCost = -1 * flow[0]
        let flowPresent = this.VPL(rate, flow) + initialCost
        return Number((flowPresent/initialCost).toFixed(2))
    }
}
