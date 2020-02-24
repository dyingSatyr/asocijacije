class Skocko {
	constructor() {}

	generateCombination() {
		let colors = ['skocko', 'tref', 'pik', 'herc', 'karo', 'zvezda']
		let result = []
		while (result.length < 4) {
			colors = this.shuffle(colors)
			result.push(colors[0])
		}
		console.log(result)
		return result
	}

	checkCombination(arr, goal) {
		let correct = 0
		let inPlace = 0
		let found = false

		arr.forEach(color => {
			if (goal.includes(color)) {
				correct++
			}
		})
		for (let i = 0; i < 4; i++) {
			if (arr[i] === goal[i]) {
				inPlace++
			}
		}

		if (inPlace == 4) {
			found = true
		}

		return {
			correct,
			inPlace,
			found
		}
	}

	shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1

			// And swap it with the current element.
			temporaryValue = array[currentIndex]
			array[currentIndex] = array[randomIndex]
			array[randomIndex] = temporaryValue
		}

		return array
	}
}

module.exports = Skocko
