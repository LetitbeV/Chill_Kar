package com.sks225.chillkar.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.sks225.chillkar.R
import com.sks225.chillkar.formatEpochTime
import com.sks225.chillkar.model.Event

class YourEventsAdapter(private val eventsList: List<Event>, private val context: Context) :
    RecyclerView.Adapter<YourEventsAdapter.EventViewHolder>() {
    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int,
    ): YourEventsAdapter.EventViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.events_rv_item, parent, false)
        return EventViewHolder(view)
    }

    override fun onBindViewHolder(holder: YourEventsAdapter.EventViewHolder, position: Int) {
        val event = eventsList[position]
        Glide.with(context).load(event.poster).into(holder.ivEventPoster)
        holder.tvEventName.text = event.name
        holder.tvEventDate.text = formatEpochTime(event.timeStamp)
    }

    override fun getItemCount(): Int {
        return eventsList.size
    }

    inner class EventViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val ivEventPoster: ImageView = itemView.findViewById(R.id.iv_event_poster)
        val tvEventName: TextView = itemView.findViewById(R.id.tv_event_name)
        val tvEventDate: TextView = itemView.findViewById(R.id.tv_event_date)
    }
}