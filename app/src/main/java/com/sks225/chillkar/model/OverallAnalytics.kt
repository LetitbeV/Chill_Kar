package com.sks225.chillkar.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class OverallAnalytics(
    val ticketsSold: Int,
    val maxTickets: Int,
    val totalRevenue: Double,
    val salesByAge: Map<Int, Int>,
    val salesByCategory: Map<EventCategory, Int>,
    val salesByGender: Map<Gender, Int>,
    val dailySales: Map<String, Int>,
) : Parcelable