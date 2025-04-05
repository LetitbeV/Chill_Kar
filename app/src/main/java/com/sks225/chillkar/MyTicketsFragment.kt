package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.sks225.chillkar.databinding.FragmentMyTicketsBinding


class MyTicketsFragment : Fragment() {
    private lateinit var binding: FragmentMyTicketsBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentMyTicketsBinding.inflate(layoutInflater, container, false)

        return binding.root
    }


}