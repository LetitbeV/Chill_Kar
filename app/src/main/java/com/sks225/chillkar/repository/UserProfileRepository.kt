package com.sks225.chillkar.repository

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import com.sks225.chillkar.model.Gender
import com.sks225.chillkar.model.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

class UserProfileRepository(private val dataStore: DataStore<Preferences>) {
    private companion object {
        val USER_NAME_KEY = stringPreferencesKey("user_name")
        val METAMASK_ADDRESS_KEY = stringPreferencesKey("metamask_address")
        val USER_AGE_KEY = intPreferencesKey("user_age")
        val USER_GENDER_KEY = intPreferencesKey("user_gender")
        val USER_REGION_KEY = stringPreferencesKey("user_region")
        const val TAG = "UserProfileRepo"
    }

    val userProfile: Flow<UserProfile> = dataStore.data
        .catch {
            if (it is IOException) {
                Log.e(TAG, "Error reading preferences.", it)
                emit(emptyPreferences())
            } else {
                throw it
            }
        }
        .map { preferences ->
            UserProfile(
                name = preferences[USER_NAME_KEY] ?: "",
                metamaskAddress = preferences[METAMASK_ADDRESS_KEY] ?: "",
                age = preferences[USER_AGE_KEY] ?: 0,
                gender = Gender.entries[preferences[USER_GENDER_KEY] ?: 0],
                region = preferences[USER_REGION_KEY] ?: "",
            )
        }

    suspend fun saveUserProfile(userProfile: UserProfile) {
        dataStore.edit { preferences ->
            preferences[USER_NAME_KEY] = userProfile.name
            preferences[METAMASK_ADDRESS_KEY] = userProfile.metamaskAddress
            preferences[USER_AGE_KEY] = userProfile.age
            preferences[USER_GENDER_KEY] = userProfile.gender.ordinal
            preferences[USER_REGION_KEY] = userProfile.region
        }
    }
}