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

class TicketsVerticalAdapter(
    private val items: Array<Event>,
    private val context: Context,
    private val onClick: (Event) -> Unit = {}
) :
    RecyclerView.Adapter<TicketsVerticalAdapter.ViewHolder>() {
    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.ticket_title)
        val date: TextView = view.findViewById(R.id.ticket_time)
        val poster: ImageView = view.findViewById(R.id.ticket_thumbnail)
        val location: TextView = view.findViewById(R.id.ticket_location)
        val price: TextView = view.findViewById(R.id.ticket_price)
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.vertical_ticket_item, viewGroup, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int = items.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.itemView.setOnClickListener {
            onClick(items[position])
        }

        holder.title.text = items[position].name
        holder.date.text = formatEpochTime(items[position].timeStamp)
        holder.location.text = items[position].location
        holder.price.text = context.resources.getString(
            R.string.ticket_price,
            items[position].generalTicket.price
        )
        Glide.with(context).load(items[position].poster).into(holder.poster)
    }
}