package com.sks225.chillkar.viewModels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sks225.chillkar.model.Event
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.model.uiState.HomeFragmentState
import com.sks225.chillkar.samples.sampleEvents
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn

class HomeFragmentViewModel : ViewModel() {
    private val _state = MutableStateFlow(HomeFragmentState())
    val state = _state.asStateFlow()
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            HomeFragmentState()
        )

    val filteredRecommendedEvents: MutableList<Event> = mutableListOf()
    val filteredTrendingEvents: MutableList<Event> = mutableListOf()
    val filteredExploreEvents: MutableList<Event> = mutableListOf()

    init {
        _state.value = _state.value.copy(
            recommendedEvents = sampleEvents,
            trendingEvents = sampleEvents,
            exploreEvents = sampleEvents
        )
        filteredRecommendedEvents.addAll(_state.value.recommendedEvents)
        filteredTrendingEvents.addAll(_state.value.trendingEvents)
        filteredExploreEvents.addAll(_state.value.exploreEvents)
    }

    fun changeFilterMethod(method: EventCategory) {
        if (_state.value.filterMethod == method) return
        filteredRecommendedEvents.clear()
        filteredTrendingEvents.clear()
        filteredExploreEvents.clear()
        if (method == EventCategory.OTHERS) {
            _state.value = _state.value.copy(filterMethod = EventCategory.OTHERS)
            filteredRecommendedEvents.addAll(_state.value.recommendedEvents)
            filteredTrendingEvents.addAll(_state.value.trendingEvents)
            filteredExploreEvents.addAll(_state.value.exploreEvents)
            return
        }
        filteredRecommendedEvents.addAll(_state.value.recommendedEvents.filter { it.category == method })
        filteredTrendingEvents.addAll(_state.value.trendingEvents.filter { it.category == method })
        filteredExploreEvents.addAll(_state.value.exploreEvents.filter { it.category == method })
        _state.value = _state.value.copy(filterMethod = method)
    }
}