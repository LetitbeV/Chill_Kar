package com.sks225.chillkar

import android.app.Application
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import com.sks225.chillkar.repository.UserProfileRepository

private const val USER_PROFILE_PREFERENCE_NAME = "user_profile_preferences"
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(
    name = USER_PROFILE_PREFERENCE_NAME
)

class ChillKarApplication : Application() {
    companion object {
        lateinit var instance: ChillKarApplication
            private set
    }

    lateinit var userProfileRepository: UserProfileRepository
    override fun onCreate() {
        super.onCreate()
        instance = this
        userProfileRepository = UserProfileRepository(dataStore)
    }
}