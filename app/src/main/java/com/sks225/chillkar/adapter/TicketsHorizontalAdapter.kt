package com.sks225.chillkar.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sks225.chillkar.R
import com.sks225.chillkar.model.Event

class TicketsHorizontalAdapter(private val items: Array<Event>) :
    RecyclerView.Adapter<TicketsHorizontalAdapter.ViewHolder>() {
    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.ticket_title)
        val date: TextView = view.findViewById(R.id.ticket_time)
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.horizontal_ticket_item, viewGroup, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int = items.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.title.text = items[position].name
        holder.date.text = items[position].timeStamp
    }
}