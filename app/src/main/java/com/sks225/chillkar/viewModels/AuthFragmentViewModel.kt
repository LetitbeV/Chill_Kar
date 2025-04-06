package com.sks225.chillkar.viewModels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.Companion.APPLICATION_KEY
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.sks225.chillkar.ChillKarApplication
import com.sks225.chillkar.R
import com.sks225.chillkar.repository.UserProfileRepository
import io.metamask.androidsdk.DappMetadata
import io.metamask.androidsdk.Ethereum
import io.metamask.androidsdk.EthereumFlow
import io.metamask.androidsdk.EthereumFlowWrapper
import io.metamask.androidsdk.Result
import io.metamask.androidsdk.SDKOptions
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class AuthFragmentViewModel(
    private val ethereum: EthereumFlowWrapper,
    private val userProfileRepository: UserProfileRepository,
) : ViewModel() {

    fun connect(onSuccess: (String) -> Unit, onError: () -> Unit) {
        viewModelScope.launch {
            val profile = userProfileRepository.userProfile.first()
            if (profile.metamaskAddress.isNotEmpty())
                return@launch

            when (val result = ethereum.connect()) {
                is Result.Success.Items -> {
                    userProfileRepository.saveUserProfile(
                        profile.copy(
                            metamaskAddress = result.value[0]
                        )
                    )
                    onSuccess(result.value[0])
                }

                else -> onError()
            }
        }
    }

    companion object {
        val Factory = viewModelFactory {
            initializer {
                val application = (this[APPLICATION_KEY] as ChillKarApplication)
                val dAppMetadata = DappMetadata(
                    name = "ChillKar",
                    url = "https://chillkar.com"
                )
                val ethereum = Ethereum(
                    application,
                    dAppMetadata,
                    SDKOptions(application.resources.getString(R.string.infura_api_key), null)
                )
                val ethereumFlow = EthereumFlow(ethereum)
                AuthFragmentViewModel(ethereumFlow, application.userProfileRepository)
            }
        }
    }
}