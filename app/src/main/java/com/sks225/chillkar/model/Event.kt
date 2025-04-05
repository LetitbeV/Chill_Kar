package com.sks225.chillkar.model

import android.net.Uri

data class Event(
    val name: String,
    val timeStamp: String,
    val poster: Uri,
    val location: String,
    val description: String,
    val category: EventCategory,
    val generalTicket: TicketInfo,
    val vipTicket: TicketInfo
)
