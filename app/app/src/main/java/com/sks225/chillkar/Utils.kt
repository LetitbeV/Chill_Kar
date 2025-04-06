package com.sks225.chillkar

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

fun formatEpochTime(epochMillis: Long): String {
    val date = Date(epochMillis)
    val formatter = SimpleDateFormat("MMMM d, yyyy h:mm a", Locale.US)
    return formatter.format(date)
}
