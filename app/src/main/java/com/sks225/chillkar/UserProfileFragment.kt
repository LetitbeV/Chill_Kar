package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.sks225.chillkar.databinding.FragmentUserProfileBinding

class UserProfileFragment : Fragment() {
    private lateinit var binding: FragmentUserProfileBinding
    private lateinit var navController: NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentUserProfileBinding.inflate(layoutInflater, container, false)
        navController = findNavController()

        binding.tvMyTickets.setOnClickListener {
            navController.navigate(R.id.action_userProfileFragment_to_myTicketsFragment)
        }

        binding.toolbar.setNavigationOnClickListener {
            navController.navigateUp()
        }
        return binding.root
    }
}