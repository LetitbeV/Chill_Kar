package com.sks225.chillkar

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.sks225.chillkar.databinding.FragmentCreateEventBinding

class CreateEventFragment : Fragment() {
    private lateinit var binding: FragmentCreateEventBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCreateEventBinding.inflate(layoutInflater,container,false)
        return binding.root
    }
}