package com.sks225.chillkar.model

data class Ticket(
    val age: Int,
    val gender: Gender,
    val timestamp: Long,
    val region:String,
    val category: EventCategory
)

enum class Gender{
    MALE,
    FEMALE
}
