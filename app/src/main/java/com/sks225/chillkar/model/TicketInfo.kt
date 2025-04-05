package com.sks225.chillkar.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class TicketInfo(
    val type: TicketType,
    val price: Int,
    val sold: Int,
    val total: Int
) : Parcelable