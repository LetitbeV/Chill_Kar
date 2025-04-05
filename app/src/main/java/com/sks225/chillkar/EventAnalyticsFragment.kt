package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.sks225.chillkar.databinding.FragmentEventAnalyticsBinding


class EventAnalyticsFragment : Fragment() {
    private lateinit var binding: FragmentEventAnalyticsBinding


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentEventAnalyticsBinding.inflate(layoutInflater, container, false)
        return binding.root
    }


}