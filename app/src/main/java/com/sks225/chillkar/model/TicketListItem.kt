package com.sks225.chillkar.model

enum class TicketCategory {
    SPORTS,
    MOVIES,
    CONCERTS,
    OTHERS
}

data class TicketListItem(
    val title: String,
    val date: String,
    val time: String = "",
    val place: String = "",
    val category: TicketCategory = TicketCategory.OTHERS,
    val price: Double = 0.0,
)
