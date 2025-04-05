package com.sks225.chillkar.samples

import com.sks225.chillkar.model.EventAnalytics
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.model.Gender

val eventAnalyticsList = mapOf(
    1 to EventAnalytics(
        category = EventCategory.SPORTS,
        ticketsSold = 150,
        totalRevenue = 1000.00,
        maxTickets = 500,
        salesByAge = mapOf(18 to 50, 25 to 70, 35 to 30),
        salesByGender = mapOf(Gender.MALE to 80, Gender.FEMALE to 70),
        dailySales = mapOf("2023-04-01" to 30, "2023-04-02" to 40, "2023-04-03" to 80)
    ),
    2 to EventAnalytics(
        category = EventCategory.CONCERTS,
        ticketsSold = 300,
        maxTickets = 1000,
        totalRevenue = 2000.00,
        salesByAge = mapOf(20 to 120, 30 to 80, 40 to 100),
        salesByGender = mapOf(Gender.MALE to 160, Gender.FEMALE to 140),
        dailySales = mapOf("2023-04-01" to 50, "2023-04-02" to 100, "2023-04-03" to 150)
    ),
    3 to EventAnalytics(
        category = EventCategory.SPORTS,
        ticketsSold = 75,
        maxTickets = 300,
        totalRevenue = 5000.00,
        salesByAge = mapOf(22 to 20, 28 to 30, 35 to 25),
        salesByGender = mapOf(Gender.MALE to 40, Gender.FEMALE to 35),
        dailySales = mapOf("2023-04-01" to 20, "2023-04-02" to 30, "2023-04-03" to 25)
    ),
    4 to EventAnalytics(
        category = EventCategory.MOVIES,
        ticketsSold = 500,
        maxTickets = 800,
        totalRevenue = 3000.00,
        salesByAge = mapOf(18 to 150, 25 to 200, 35 to 150),
        salesByGender = mapOf(Gender.MALE to 250, Gender.FEMALE to 250),
        dailySales = mapOf("2023-04-01" to 150, "2023-04-02" to 200, "2023-04-03" to 150)
    ),
    5 to EventAnalytics(
        category = EventCategory.MOVIES,
        ticketsSold = 200,
        maxTickets = 500,
        totalRevenue = 1000.00,
        salesByAge = mapOf(30 to 80, 40 to 70, 50 to 50),
        salesByGender = mapOf(Gender.MALE to 100, Gender.FEMALE to 100),
        dailySales = mapOf("2023-04-01" to 50, "2023-04-02" to 80, "2023-04-03" to 70)
    ),
    6 to EventAnalytics(
        category = EventCategory.OTHERS,
        ticketsSold = 0,
        maxTickets = 200,
        totalRevenue = 0.0,
        salesByAge = mapOf(),
        salesByGender = mapOf(),
        dailySales = mapOf()
    ),
    7 to EventAnalytics(
        category = EventCategory.OTHERS,
        ticketsSold = 350,
        maxTickets = 1000,
        totalRevenue = 10000.00,
        salesByAge = mapOf(18 to 150, 25 to 100, 40 to 100),
        salesByGender = mapOf(Gender.MALE to 180, Gender.FEMALE to 170),
        dailySales = mapOf("2023-04-01" to 120, "2023-04-02" to 130, "2023-04-03" to 100)
    ),
    8 to EventAnalytics(
        category = EventCategory.MOVIES,
        ticketsSold = 120,
        maxTickets = 400,
        totalRevenue = 6000.00,
        salesByAge = mapOf(21 to 40, 30 to 50, 45 to 30),
        salesByGender = mapOf(Gender.MALE to 60, Gender.FEMALE to 60),
        dailySales = mapOf("2023-04-01" to 40, "2023-04-02" to 50, "2023-04-03" to 30)
    ),
    9 to EventAnalytics(
        category = EventCategory.MOVIES,
        ticketsSold = 450,
        maxTickets = 600,
        totalRevenue = 10000.00,
        salesByAge = mapOf(20 to 200, 30 to 150, 40 to 100),
        salesByGender = mapOf(Gender.MALE to 220, Gender.FEMALE to 230),
        dailySales = mapOf("2023-04-01" to 150, "2023-04-02" to 150, "2023-04-03" to 150)
    ),
    10 to EventAnalytics(
        category = EventCategory.CONCERTS,
        ticketsSold = 50,
        maxTickets = 300,
        totalRevenue = 5000.00,
        salesByAge = mapOf(19 to 20, 27 to 20, 35 to 10),
        salesByGender = mapOf(Gender.MALE to 30, Gender.FEMALE to 20),
        dailySales = mapOf("2023-04-01" to 10, "2023-04-02" to 20, "2023-04-03" to 20)
    )
)