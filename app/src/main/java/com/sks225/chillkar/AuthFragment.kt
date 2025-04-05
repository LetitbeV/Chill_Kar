package com.sks225.chillkar

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.sks225.chillkar.databinding.FragmentAuthBinding

class AuthFragment : Fragment() {
    private lateinit var binding: FragmentAuthBinding
    private lateinit var navController: NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentAuthBinding.inflate(inflater, container, false)
        navController = findNavController()

        binding.btnLoginUser.setOnClickListener {
            navController.navigate(R.id.action_authFragment_to_homeFragment)
        }

        binding.btnLoginOrganizer.setOnClickListener {
            navController.navigate(R.id.action_authFragment_to_dashboardFragment)
        }
        return binding.root
    }
}