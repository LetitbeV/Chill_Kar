package com.sks225.chillkar.model.uiState

import com.sks225.chillkar.model.Event
import com.sks225.chillkar.model.EventCategory

data class HomeFragmentState(
    val recommendedEvents: List<Event> = emptyList(),
    val trendingEvents: List<Event> = emptyList(),
    val exploreEvents: List<Event> = emptyList(),
    val filterMethod: EventCategory = EventCategory.OTHERS,
)
