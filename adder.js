// Thanks Implied_Slight

class Adder {
    success(total) {
        return {
            type: 'success',
            result: total
        };
    }

    error(offender) {
        return {
            type: 'error',
            result: offender
        };
    }

    add(numbers) {
        let total = 0;
        for (var n in numbers) {
            const entry = numbers[n];
            const parsed = parseFloat(entry);
            if (isNaN(parsed)) {
                return this.error(entry);
            } else {
                total += parsed;
            }
        }
        return this.success(total);
    }
}

module.exports = Adder;
