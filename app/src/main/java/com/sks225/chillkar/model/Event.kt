package com.sks225.chillkar.model

import android.net.Uri
import android.os.Parcelable

@kotlinx.parcelize.Parcelize
data class Event(
    val eventId: Int,
    val name: String,
    val timeStamp: Long,
    val poster: Uri,
    val location: String,
    val description: String,
    val category: EventCategory,
    val generalTicket: TicketInfo,
    val vipTicket: TicketInfo,
) : Parcelable
