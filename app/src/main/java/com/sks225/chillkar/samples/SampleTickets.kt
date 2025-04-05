package com.sks225.chillkar.samples

import android.net.Uri
import com.sks225.chillkar.model.Event
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.model.TicketInfo
import com.sks225.chillkar.model.TicketType

val sampleEvents = listOf(
    Event(
        name = "Summer Music Fest",
        timeStamp = 1743722400000, // April 3, 2025 10:00 PM (example)
        poster = Uri.parse("https://picsum.photos/id/1/200/300"),
        location = "Central Park, NYC",
        description = "Join us for an unforgettable night of live music under the stars!",
        category = EventCategory.CONCERTS,
        generalTicket = TicketInfo(TicketType.GENERAL, price = 50, sold = 120, total = 200),
        vipTicket = TicketInfo(TicketType.VIP, price = 120, sold = 30, total = 50)
    ),
    Event(
        name = "Championship Finals",
        timeStamp = 1743808800000, // April 4, 2025 10:00 PM
        poster = Uri.parse("https://picsum.photos/id/2/200/300"),
        location = "Madison Square Garden, NYC",
        description = "Watch the top teams battle for the championship title!",
        category = EventCategory.SPORTS,
        generalTicket = TicketInfo(TicketType.GENERAL, price = 75, sold = 300, total = 500),
        vipTicket = TicketInfo(TicketType.VIP, price = 200, sold = 80, total = 100)
    ),
    Event(
        name = "Premiere Night: The Lost Galaxy",
        timeStamp = 1743895200000, // April 5, 2025 10:00 PM
        poster = Uri.parse("https://picsum.photos/id/3/200/300"),
        location = "Grand Cinema Hall, LA",
        description = "Be the first to experience the sci-fi adventure of the year!",
        category = EventCategory.MOVIES,
        generalTicket = TicketInfo(TicketType.GENERAL, price = 20, sold = 180, total = 200),
        vipTicket = TicketInfo(TicketType.VIP, price = 40, sold = 15, total = 20)
    ),
    Event(
        name = "Food Carnival 2025",
        timeStamp = 1743981600000, // April 6, 2025 10:00 PM
        poster = Uri.parse("https://picsum.photos/id/4/200/300"),
        location = "Downtown Square, Chicago",
        description = "Taste cuisines from around the world and enjoy live cooking shows.",
        category = EventCategory.OTHERS,
        generalTicket = TicketInfo(TicketType.GENERAL, price = 10, sold = 500, total = 1000),
        vipTicket = TicketInfo(TicketType.VIP, price = 25, sold = 100, total = 150)
    ),
    Event(
        name = "Indie Rock Night",
        timeStamp = 1744068000000, // April 7, 2025 10:00 PM
        poster = Uri.parse("https://picsum.photos/id/5/200/300"),
        location = "Echo Arena, Seattle",
        description = "Experience the raw energy of the best indie rock bands live!",
        category = EventCategory.CONCERTS,
        generalTicket = TicketInfo(TicketType.GENERAL, price = 30, sold = 220, total = 300),
        vipTicket = TicketInfo(TicketType.VIP, price = 60, sold = 50, total = 60)
    )
)
