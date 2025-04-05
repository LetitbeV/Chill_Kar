package com.sks225.chillkar.model

data class TicketInfo(
    val type: TicketType,
    val price: Int,
    val sold: Int,
    val total: Int
)