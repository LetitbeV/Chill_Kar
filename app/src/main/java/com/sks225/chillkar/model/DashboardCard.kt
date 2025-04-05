package com.sks225.chillkar.model

data class DashboardCard(
    val ticketsSold: Int,
    val revenue: Int,
    val dailySale: Map<Int,Int>
)
