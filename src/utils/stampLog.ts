/**
 * If a log is being kept, add a time stamped line.
 * @param log  Optional time stamped log to extend
 * @param lineToAdd Content to add to line.
 * @returns undefined or log extended by time stamped `lineToAdd` and new line.
 */
export function stampLog(log: string | undefined, lineToAdd: string): string | undefined {
    if (typeof log !== 'string') return undefined
    return log + `${new Date().toISOString()} ${lineToAdd}\n`
}

/**
 * Replaces individual timestamps with delta msecs.
 * Looks for two network crossings and adjusts clock for clock skew if found.
 * Assumes log built by repeated calls to `stampLog`
 * @param log Each logged event starts with ISO time stamp, space, rest of line, terminated by `\n`.
 * @returns reformated multi-line event log
 */
export function stampLogFormat(log?: string): string {
    if (typeof (log) !== 'string') return ''
    const logLines = log.split('\n')
    const data: {
        when: number,
        rest: string,
        delta: number,
        newClock: boolean
    }[] = []
    let last = 0
    const newClocks: number[] = []
    for (const line of logLines) {
        const spaceAt = line.indexOf(' ')
        if (spaceAt > -1) {
            const when = new Date(line.substring(0, spaceAt)).getTime()
            const rest = line.substring(spaceAt + 1)
            const delta = when - (last || when)
            const newClock = rest.indexOf('**NETWORK**') > -1
            if (newClock) newClocks.push(data.length)
            data.push({ when, rest, delta, newClock })
            last = when
        }
    }
    const total = data[data.length - 1].when - data[0].when
    if (newClocks.length === 2) {
        // Adjust for two network crossing times and clock skew between two clocks.
        // Assumes a block of events on one clock,
        // then a block of events on second clock,
        // and a final block of events back on the original clock.
        const block1 = data[newClocks[0] - 1].when - data[0].when
        const block2 = data[newClocks[1] - 1].when - data[newClocks[0]].when
        const block3 = data[data.length - 1].when - data[newClocks[1]].when
        const network = total - block1 - block2 - block3
        const network1 = Math.ceil(network / 2)
        const network2 = network - network1
        // Adjust newClock deltas to each be "half" of network time.
        data[newClocks[0]].delta = network1
        data[newClocks[1]].delta = network2
    }
    let log2 = `${new Date(data[0].when).toISOString()} Total = ${total} msecs\n`
    for (const d of data) {
        let df = d.delta.toString()
        df = `${' '.repeat(8 - df.length)}${df}`
        log2 += `${df} ${d.rest}\n`
    }
    return log2
}