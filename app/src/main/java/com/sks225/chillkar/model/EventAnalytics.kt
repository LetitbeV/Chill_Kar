package com.sks225.chillkar.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class EventAnalytics(
    val category: EventCategory,
    val ticketsSold: Int,
    val totalRevenue: Double,
    val maxTickets: Int,
    val salesByAge: Map<Int, Int>,
    val salesByGender: Map<Gender, Int>,
    val dailySales: Map<String, Int>,
) : Parcelable