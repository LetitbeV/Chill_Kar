package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.sks225.chillkar.databinding.FragmentCreateEventBinding

class CreateEventFragment : Fragment() {
    private lateinit var binding: FragmentCreateEventBinding
    private lateinit var navController: NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCreateEventBinding.inflate(layoutInflater, container, false)
        navController = findNavController()

        binding.toolbar.setNavigationOnClickListener {
            navController.navigateUp()
        }
        return binding.root
    }
}