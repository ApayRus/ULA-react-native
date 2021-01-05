// auto excercise is related to lesson (subchapter)
// with type "oneLineOneFile" or "timing" - both contain phrases
// excercise = { source: lesson, type, count }
// source: lesson, subchapter
// type: textToText || soundToText
// count: from 1 to total words/phrases count in source (lesson)

import { Random } from 'random-js'

export default class Exercises extends Random {
    constructor(phrasesCount) {
        super()
        const range = []
        for (let i = 1; i <= phrasesCount; i++) {
            range.push(i)
        }
        this.phrasesCount = phrasesCount
        this.range = range
    }

    /**
     * generates indexes for one real phrase, and N fake ones
     * [ [8,1,15], [22, 5, 1], ... ]
     * the first element is correct variant, the rest are fake
     * @param {number} exercisesCount
     * @param {number} fakeCount
     */
    getIndexes(exercisesCount, fakeCount = 2) {
        let phrasesResult = []
        while (phrasesResult.length < exercisesCount) {
            const phrasesBasic = this.shuffle(this.range)
            phrasesResult.push(...phrasesBasic)
        }
        phrasesResult = phrasesResult.slice(0, exercisesCount)

        // we stick to first element as correct
        // for bypass all phrases in our exercises, without repeats
        const exercises = phrasesResult.map(correctElement => {
            const possibleFakeElements = this.range.filter(
                fakeElement => correctElement !== fakeElement
            )
            const fakeElements = this.sample(possibleFakeElements, fakeCount)
            return [correctElement, ...fakeElements] // [14, 7, 16]
        })

        return exercises
    }
}