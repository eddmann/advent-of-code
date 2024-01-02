private typealias Id = String

private data class Message(val from: Id, val to: Id, val pulse: Boolean)

private abstract class Module(open val id: Id, open val incoming: List<Id>, open val outgoing: List<Id>) {
    abstract fun handle(message: Message): List<Message>

    companion object {
        fun build(input: String): Pair<Broadcast, Map<String, Module>> {
            val mappings = input.lines().map {
                val (id, outgoing) = it.split(" -> ")
                id to outgoing.split(", ")
            }

            val broadcaster = Broadcast(mappings.first { it.first == "broadcaster" }.second)

            val modules = mappings.filter { it.first != "broadcaster" }.associate { mapping ->
                val (typeAndId, outgoing) = mapping
                val type = typeAndId.first()
                val id = typeAndId.drop(1)

                val incoming = mappings.mapNotNull { if (it.second.contains(id)) { it.first.drop(1) } else { null } }

                val module = when (type) {
                    '%' -> FlipFlop(id, incoming, outgoing)
                    '&' -> Conjunction(id, incoming, outgoing)
                    else -> throw RuntimeException()
                }

                id to module
            }

            return broadcaster to modules
        }
    }
}

private data class FlipFlop(override val id: String, override val incoming: List<String>, override val outgoing: List<String>): Module(id, incoming, outgoing) {
    private var previousPulse = false

    override fun handle(message: Message): List<Message> {
        if (message.pulse) return listOf()
        previousPulse = !previousPulse
        return outgoing.map { outgoingId -> Message(id, outgoingId, previousPulse) }
    }
}

private data class Conjunction(override val id: String, override val incoming: List<String>, override val outgoing: List<String>): Module(id, incoming, outgoing) {
    private var history: MutableMap<String, Boolean> = incoming.associateWith { false }.toMutableMap()

    override fun handle(message: Message): List<Message> {
        history[message.from] = message.pulse
        return outgoing.map { outgoingId -> Message(id, outgoingId, !history.values.all { it }) }
    }
}

private data class Broadcast(val outgoing: List<String>) {
    fun press() = outgoing.map { outgoingId -> Message("broadcaster", outgoingId, false) }
}

private fun part1(input: String): Long {
    val (broadcaster, modules) = Module.build(input)

    var lowPulses = 0L
    var highPulses = 0L
    val queue = ArrayDeque<Message>()

    repeat(1000) {
        lowPulses++
        queue.addAll(broadcaster.press())

        while (queue.isNotEmpty()) {
            val message = queue.removeFirst()
            if (message.pulse) highPulses++ else lowPulses++
            modules[message.to]?.let { module -> queue.addAll(module.handle(message)) }
        }
    }

    return lowPulses * highPulses
}

private fun part2(input: String): Long {
    val (broadcaster, modules) = Module.build(input)

    var presses = 0L
    val queue = ArrayDeque<Message>()

    val lastModule = modules.values.first { it.outgoing.contains("rx") }.id
    val connectorsToLastModule = modules.values.mapNotNull { if (it.outgoing.contains(lastModule)) { it.id } else { null } }
    val pressesToHighPulse = connectorsToLastModule.associateWith { 0L }.toMutableMap()

    while (pressesToHighPulse.any { it.value == 0L }) {
        presses++
        queue.addAll(broadcaster.press())

        while (queue.isNotEmpty()) {
            val message = queue.removeFirst()
            if (message.to == lastModule && message.pulse) pressesToHighPulse[message.from] = presses
            modules[message.to]?.let { module -> queue.addAll(module.handle(message)) }
        }
    }

    return pressesToHighPulse.values.reduce(::lcm)
}

fun main() {
    val input = readInput("Day20")
    part1(input).println()
    part2(input).println()
}
