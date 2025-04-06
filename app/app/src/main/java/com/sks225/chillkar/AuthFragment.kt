package com.sks225.chillkar

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import com.sks225.chillkar.databinding.FragmentAuthBinding
import com.sks225.chillkar.viewModels.AuthFragmentViewModel

class AuthFragment : Fragment() {
    private lateinit var binding: FragmentAuthBinding
    private lateinit var navController: NavController
    private val viewModel: AuthFragmentViewModel by viewModels<AuthFragmentViewModel> {
        AuthFragmentViewModel.Factory
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = FragmentAuthBinding.inflate(inflater, container, false)
        navController = findNavController()

        viewModel.connect(onSuccess = {
            Log.d("Tag", it)
        }, onError = {
            Snackbar.make(
                requireContext(),
                binding.root,
                "Failed to Connect",
                Snackbar.LENGTH_SHORT
            ).show()
        })

        binding.btnLoginUser.setOnClickListener {
            navController.navigate(R.id.action_authFragment_to_homeFragment)
        }

        binding.btnLoginOrganizer.setOnClickListener {
            navController.navigate(R.id.action_authFragment_to_dashboardFragment)
        }

        return binding.root
    }
}