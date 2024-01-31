private typealias Id = String

private data class Pulse(val from: Id, val to: Id, val isHigh: Boolean)

private abstract class Module(open val id: Id, open val incoming: List<Id>, open val outgoing: List<Id>) {
    abstract fun handle(pulse: Pulse): List<Pulse>

    companion object {
        fun of(input: String): Pair<Broadcast, Map<String, Module>> {
            val mappings = input.lines().map {
                val (id, outgoing) = it.split(" -> ")
                id to outgoing.split(", ")
            }

            val broadcaster = Broadcast(mappings.first { it.first == "broadcaster" }.second)

            val modules = mappings.filter { it.first != "broadcaster" }.associate { mapping ->
                val (typeAndId, outgoing) = mapping
                val type = typeAndId.first()
                val id = typeAndId.drop(1)

                val incoming = mappings.mapNotNull { if (it.second.contains(id)) it.first.drop(1) else null }

                val module = when (type) {
                    '%' -> FlipFlop(id, incoming, outgoing)
                    else -> Conjunction(id, incoming, outgoing)
                }

                id to module
            }

            return broadcaster to modules
        }
    }
}

private data class FlipFlop(override val id: String, override val incoming: List<String>, override val outgoing: List<String>): Module(id, incoming, outgoing) {
    private var wasPreviousPulseHigh = false

    override fun handle(pulse: Pulse): List<Pulse> {
        if (pulse.isHigh) return listOf()
        wasPreviousPulseHigh = !wasPreviousPulseHigh
        return outgoing.map { Pulse(id, it, wasPreviousPulseHigh) }
    }
}

private data class Conjunction(override val id: String, override val incoming: List<String>, override val outgoing: List<String>): Module(id, incoming, outgoing) {
    private var history: MutableMap<String, Boolean> = incoming.associateWith { false }.toMutableMap()

    override fun handle(pulse: Pulse): List<Pulse> {
        history[pulse.from] = pulse.isHigh
        return outgoing.map { outgoingId -> Pulse(id, outgoingId, !history.values.all { it }) }
    }
}

private data class Broadcast(val outgoing: List<String>) {
    fun press() = outgoing.map { Pulse("broadcaster", it, false) }
}

private fun part1(input: String): Long {
    val (broadcaster, modules) = Module.of(input)

    var lowPulses = 0L
    var highPulses = 0L
    val queue = ArrayDeque<Pulse>()

    repeat(1000) {
        lowPulses++
        queue.addAll(broadcaster.press())

        while (queue.isNotEmpty()) {
            val pulse = queue.removeFirst()
            if (pulse.isHigh) highPulses++ else lowPulses++
            modules[pulse.to]?.let { module -> queue.addAll(module.handle(pulse)) }
        }
    }

    return lowPulses * highPulses
}

private fun part2(input: String): Long {
    val (broadcaster, modules) = Module.of(input)

    var presses = 0L
    val queue = ArrayDeque<Pulse>()

    val lastModuleId = modules.values.first { it.outgoing.contains("rx") }.id
    val connectionsToLastModule = modules.values.mapNotNull { if (it.outgoing.contains(lastModuleId)) it.id else null }
    val pressesToHighPulse = connectionsToLastModule.associateWith { 0L }.toMutableMap()

    while (pressesToHighPulse.any { it.value == 0L }) {
        presses++
        queue.addAll(broadcaster.press())

        while (queue.isNotEmpty()) {
            val pulse = queue.removeFirst()
            if (pulse.to == lastModuleId && pulse.isHigh) pressesToHighPulse[pulse.from] = presses
            modules[pulse.to]?.let { module -> queue.addAll(module.handle(pulse)) }
        }
    }

    return pressesToHighPulse.values.reduce(::lcm)
}

fun main() {
    val input = readInput("Day20")
    part1(input).println()
    part2(input).println()
}
