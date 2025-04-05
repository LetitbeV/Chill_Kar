package com.sks225.chillkar.model

data class Event(
    val name: String,
    val timeStamp: String,
    val ticketsSold: Int,
    val totalTickets: Int,
    val ticketPrice: Pair<Int, Int>,
    val poster: Int,
    val location: String,
    val description: String
)
